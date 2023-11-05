

// Functions to read/write the JSON object for the given name
// from the shared creds config file in the oclif config directory.
// The returned object is a JSON object with dynamic
// fields, depending what the user has stored.
// The file location uses OCLIF's config directory, which is
// at the given OCLIF Command object's this.config.configDir
// property. The credential file name is creds.yaml.
// Writing should create the file name with secure permissions.
// Reading should check the file permissions and throw an error
// if they're not secure. 

import { Command } from "@oclif/core";
import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import yaml from "yaml";

// getCredFilePath returns the path to the creds file.
const getCredFilePath = (command: Command): string => {
  return path.join(command.config.configDir, 'creds.yaml');
};

// only the user should be able to read/write the creds file.
const SECURE_FILE_PERMISSIONS = 0o600;

// readCredsFile reads the entire YAML file and returns it.
const readCredsFile = async (command: Command): Promise<any> => {
  const filePath = getCredFilePath(command);
  try {
    const fileStats = await fsPromises.stat(filePath);
    if ((fileStats.mode & 0o777) !== SECURE_FILE_PERMISSIONS) {
      command.error(`File permissions for ${filePath} are insecure. Please run: chmod 600 ${filePath}`);
    }
    const fileDescriptor = await fsPromises.open(filePath, 'r');
    try {
      const fileContents = await fsPromises.readFile(filePath, 'utf8');
      return yaml.parse(fileContents);
    } finally {
      await fileDescriptor.close();
    }
  } catch (err: any) {
    if (err?.code === 'ENOENT') {
      console.log('File doesn\'t exist');
      return {}; // file doesn't exist yet, same as no creds
    }
    throw err;
  }
};

// writeCredsFile writes the given object to the YAML file.
const writeCredsFile = async (command: Command, creds: any): Promise<void> => {
  const filePath = getCredFilePath(command);
  const fileDescriptor = await fsPromises.open(filePath, 'w', SECURE_FILE_PERMISSIONS);
  try {
    await fileDescriptor.writeFile(yaml.stringify(creds));
  } finally {
    await fileDescriptor.close();
  }
}

//// Exported API ////

export type Credentials<T> = {
  [key: string]: T;
};

export interface EmailAndPassword {
  email: string;
  password: string;
}

export interface UsernameAndPassword {
  username: string;
  password: string;
}

// getCreds returns the JSON object for the given name.
// If the name doesn't exist, it returns undefined.
export const readCreds = async <T>(command: Command, name: string): Promise<T> => {
  const credsFile = await readCredsFile(command);
  const creds: T | undefined = credsFile[name];
  if (creds === undefined) {
    const credFilePath = getCredFilePath(command);
    command.error(`No credentials found for ${name}. Please edit ${credFilePath}, add entry for '${name}' and run 'chmod 0600 ${credFilePath}'.`);
  }
  return creds;
}


//
export const writeCreds = async <T>(
  command: Command,
  name: string,
  creds: T,
) => {
  const allCreds = await readCredsFile(command);
  const updatedCreds: Credentials<T> = { ...allCreds, [name]: creds };
  await writeCredsFile(command, updatedCreds);
};

// deleteCredentials deletes the JSON object for the given name.
export const deleteCreds = async (command: Command, name: string) => {
  const allCreds = await readCredsFile(command);
  delete allCreds[name];
  await writeCredsFile(command, allCreds);
};
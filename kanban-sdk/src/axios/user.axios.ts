import { AxiosInstance } from "axios";
import { ISuccessResponse, IUser } from "../api";
import { ISignInResponse, IUserResponse, IUserSignIn, IUserUpdate } from "../models/dto";

/**
 * gave particular user of specific ID
 * @param instance
 * @param id
 * @returns
 * 
 */
export const getUserById = async (
  instance: AxiosInstance,
  id: string
): Promise<ISuccessResponse> => {
  const url = `api/user/${id}`;
  const response = await instance.get<ISuccessResponse>(url);
  const { data } = response;
  return data;
};

/**
 * gave particular user of specific username
 * @param instance
 * @param username
 * @returns
 * 
 */
export const getUserByusername = async (
    instance: AxiosInstance,
    username: string
  ): Promise<ISuccessResponse> => {
    const url = `api/users/userByUsername/${username}`;
    const response = await instance.get<ISuccessResponse>(url);
    const { data } = response;
    return data;
  };

/**
 * create new new and returns reponse
 * @param instance
 * @param data
 * @returns
 * 
 */
export const createUser = async (
  instance: AxiosInstance,
  data: IUser
): Promise<ISuccessResponse> => {
  const url = `api/sign-up`;
  const res = await instance.post<ISuccessResponse>(url, data);
  return res.data;
};

/**
 * Signs in a user with the provided credentials
 * @param instance
 * @param data
 * @returns
 * 
 */
export const signInToUser = async (
  instance: AxiosInstance,
  data: IUserSignIn
): Promise<ISignInResponse> => {
  const url = `api/sign-in`;
  const res = await instance.post<ISignInResponse>(url, data);
  return res.data;
};

/**
 * Update the particular user by company id
 * @param instance
 * @param id
 * @param data
 * @returns
 * 
 */
export const updateUser = async (
  instance: AxiosInstance,
  id: string,
  data: IUserUpdate
): Promise<ISuccessResponse> => {
    const url = `api/user/${id}`;
  const res = await instance.patch<ISuccessResponse>(url, data);
  return res.data;
};

/**
 * Delete user by user id
 * @param instance
 * @param id
 * @returns
 * 
 */
export const deleteUser = async (
  instance: AxiosInstance,
  id: string
): Promise<ISuccessResponse> => {
    const url = `api/user/${id}`;
  const res = await instance.delete<ISuccessResponse>(url);
  return res.data;
};

/**
 * gave the list of all user
 * @param instance
 * @returns
 * 
 */
export const getAllusers = async (
  instance: AxiosInstance
): Promise<IUserResponse> => {
    const url = `api/users`;
  const res = await instance.get<IUserResponse>(url);
  return res.data;
};
export const signOutUser = {};

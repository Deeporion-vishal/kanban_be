import { AxiosInstance } from "axios";
import { IBoardResponse, IBoardUpdatereq } from "../models/dto";

/**
 * Retrieves all boards for the specified user.
 * @param instance
 * @param userId
 * @returns
 *
 */
export const userAllBoards = async (
  instance: AxiosInstance,
  userId: string
): Promise<IBoardResponse> => {
  const url = `api/users/user/${userId}/boards`;

  const response = await instance.get<IBoardResponse>(url);

  const { data } = response;
  return data;
};

/**
 * Saves a new board for the specified user.
 * @param instance
 * @param userId
 * @returns
 *
 */
export const saveBoardToUser = async (
  instance: AxiosInstance,
  userId: string
): Promise<IBoardResponse> => {
  const url = `api/users/user/${userId}/boards/board`;

  const response = await instance.post<IBoardResponse>(url);

  const { data } = response;
  return data;
};

/**
 * Saves a new board for the specified user.
 * @param instance
 * @param userId
 * @param body
 * @returns
 *
 */
export const updateBoardOfUser = async (
  instance: AxiosInstance,
  boardId: string,
  body:IBoardUpdatereq
): Promise<IBoardResponse> => {
  const url = `api/boards/board/${boardId}`;

  const response = await instance.patch<IBoardResponse>(url,body);

  const { data } = response;
  return data;
};
/**
 * Deletes a board with the specified board ID.
 * @param instance
 * @param boardId
 * @returns
 *
 */
export const deleteBoardFromUser = async (
  instance: AxiosInstance,
  boardId: string
): Promise<any> => {
  const url = `api/boards/board/${boardId}`;

  const response = await instance.delete<any>(url);

  const { data } = response;
  return data;
};

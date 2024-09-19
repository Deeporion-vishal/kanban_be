import { AxiosInstance } from "axios";
import { ITaskRequest, ITaskUpdateReq } from "../api";

export const saveTask = async (
  instance: AxiosInstance,
  boardId: string,
  body: ITaskRequest
): Promise<any> => {
  const url = `api/boards/board/${boardId}/tasks/task`;
  const response = await instance.post<any>(url, body);

  const { data } = response;
  return data;
};
/**
 * Saves a new board for the specified user.
 * @param instance
 * @param taskId
 * @param body
 * @returns
 *
 */
export const updateTask = async (
  instance: AxiosInstance,
  taskId: string,
  body:ITaskUpdateReq
): Promise<any> => {
  const url = `api/tasks/task/${taskId}`;
  const response = await instance.patch<any>(url,body);

  const { data } = response;
  return data;
};

export const deleteTask = async (
  instance: AxiosInstance,
  taskId: string
): Promise<any> => {
  const url = `api/tasks/task/${taskId}`;
  const response = await instance.delete(url);

  const { data } = response;
  return data;
};

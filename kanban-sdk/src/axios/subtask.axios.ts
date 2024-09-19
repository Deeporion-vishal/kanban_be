import { AxiosInstance } from "axios";
import { ISubTaskRequest, ISubTaskUpdateReq } from "../models/dto";

export const saveSubTask = async (
  instance: AxiosInstance,
  taskId: string,
  body: ISubTaskRequest
): Promise<any> => {
  const url = `api/tasks/task/${taskId}/subtasks/subtask`;
  const response = await instance.post<any>(url, body);

  const { data } = response;
  return data;
};

/**
 * Saves a new board for the specified user.
 * @param instance
 * @param subTaskId
 * @param body
 * @returns
 *
 */
export const updateSubTask = async (
  instance: AxiosInstance,
  subTaskId: string,
  body:ISubTaskUpdateReq
): Promise<any> => {
  const url = `api/subtasks/subtask/${subTaskId}`;
  const response = await instance.patch<any>(url,body);

  const { data } = response;
  return data;
};

export const deleteSubtask = async (
  instance: AxiosInstance,
  subTaskId: string
): Promise<any> => {
  const url = `api/subtasks/subtask/${subTaskId}`;
  const response = await instance.delete<any>(url);

  const { data } = response;
  return data;
};

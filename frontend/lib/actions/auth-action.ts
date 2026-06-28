"use server";

import { AxiosError } from "axios";
import {
  loginApi,
  LoginPayload,
  registerApi,
  RegisterPayload,
  updateProfileApi,
  whoamiApi,
  requestPasswordResetApi,
  resetPasswordApi,
} from "../api/auth";

import {
  clearAuthCookies,
  getTokenCookie,
  setTokenCookie,
  storeUserData,
} from "@/lib/cookies";

const getActionError = (
  error: unknown,
  fallbackMessage: string,
) => {
  const axiosError = error as AxiosError<{
    success: boolean;
    message: string;
    data?: unknown;
  }>;

  return (
    axiosError.response?.data || {
      success: false,
      message: fallbackMessage,
    }
  );
};

export const registerAction = async (
  payload: RegisterPayload
) => {
  try {
    return await registerApi(payload);
  } catch (error: unknown) {
    return getActionError(error, "Registration failed");
  }
};

export const loginAction = async (
  payload: LoginPayload
) => {
  try {
    const response = await loginApi(payload);

    if (response.data.token) {
      await setTokenCookie(response.data.token);
    }

    if (response.data.user) {
      await storeUserData(response.data.user);
    }

    return response;
  } catch (error: unknown) {
    return getActionError(error, "Login failed");
  }
};

export const getCurrentUserAction = async () => {
  const token = await getTokenCookie();

  if (!token) {
    return {
      success: false,
      message: "You need to login first",
      data: null,
    };
  }

  try {
    return await whoamiApi(token);
  } catch (error: unknown) {
    return {
      ...getActionError(error, "Unable to fetch user"),
      data: null,
    };
  }
};

export const updateProfileAction = async (payload: FormData) => {
  const token = await getTokenCookie();

  if (!token) {
    return {
      success: false,
      message: "You need to login first",
      data: null,
    };
  }

  try {
    const response = await updateProfileApi(payload, token);

    if (response?.data) {
      await storeUserData(response.data);
    }

    return response;
  } catch (error: unknown) {
    return {
      ...getActionError(error, "Profile update failed"),
      data: null,
    };
  }
};

export const logoutAction = async () => {
  await clearAuthCookies();

  return {
    success: true,
    message: "Logged out successfully",
  };
};

export const requestPasswordResetAction = async (email: string) => {
  try {
    return await requestPasswordResetApi(email);
  } catch (error: unknown) {
    return getActionError(error, "Unable to send password reset email");
  }
};

export const resetPasswordAction = async (token: string, newPassword: string) => {
  try {
    return await resetPasswordApi(token, newPassword);
  } catch (error: unknown) {
    return getActionError(error, "Unable to reset password");
  }
};

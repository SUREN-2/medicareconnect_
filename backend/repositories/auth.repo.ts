import { AppError } from "../lib/error";
import { supabase, supabaseAdmin } from "../lib/supabase";
import { LoginInput, SignupInput } from "../types/auth.types";

export const loginRepo = async ({ email, password }: LoginInput) => {
  try{
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Supabase refresh error:", error.message);
    return null;
  }

  return data;
  
 
    } catch (err) {
      throw new AppError("Database connection failed", 503);
    }
}

export const signupRepo = async ({ email, password, name }: SignupInput) => {
  try{
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: undefined,
    },
  });
  

  if (error) {
    throw new Error(error.message);
  }

  const user = data.user;

  console.log(user);
  if (!user) {
    throw new Error("User creation failed");
  }

  const { error: profileError } = await supabaseAdmin.from("profiles").insert({
    id: user.id,
    name,
  });

  // const { error: mediError } = await supabaseAdmin.from("medications").insert({
  //   patient_id: user.id,
  //   name : "Dolo",
  //   dosage: "500g",
  // });

  // if (error) {
  //       throw new AppError("Failed to fetch medication logs", 500);
  //     }
  // if (mediError) {
  //   throw new Error(mediError.message);
  // }

  if (profileError) {
    throw new Error(profileError.message);
  }

  

  
  
      return user;
    } catch (err) {
      throw new AppError("Database connection failed", 503);
    }
};


export const refreshRepo = async (refreshToken: string) => {
  const { data, error } = await supabase.auth.refreshSession({
    refresh_token: refreshToken,
  });

  if (error) {
    console.error("Supabase refresh error:", error.message);
    return null;
  }

  return data;
};





export const logoutRepo = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Supabase logout error:", error.message);
    return false;
  }

  return true;
};
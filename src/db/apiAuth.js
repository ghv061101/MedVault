import supabase, { supabaseUrl } from "./supabase";

/* ---------------------- LOGIN ---------------------- */

export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  return data;
}

/* ---------------------- SIGNUP ---------------------- */

export async function signup({ name, email, password, profile_pic }) {
  let finalProfilePicUrl = null;

  // CASE 1: If user uploaded an actual image (File object)
  if (profile_pic instanceof File) {
    const fileName = `dp-${name.split(" ").join("-")}-${Math.random()}`;

    const { error: storageError } = await supabase.storage
      .from("profile_pic")
      .upload(fileName, profile_pic);

    if (storageError) throw new Error(storageError.message);

    finalProfilePicUrl = `${supabaseUrl}/storage/v1/object/public/profile_pic/${fileName}`;
  }

  // CASE 2: No upload → auto avatar URL (string)
  else if (typeof profile_pic === "string") {
    finalProfilePicUrl = profile_pic;
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        profile_pic: finalProfilePicUrl,
      },
    },
  });

  if (error) throw new Error(error.message);

  return data;
}

/* ---------------------- GET CURRENT USER ---------------------- */

export async function getCurrentUser() {
  const { data: session, error } = await supabase.auth.getSession();

  if (!session.session) return null;
  if (error) throw new Error(error.message);

  return session.session?.user;
}

/* ---------------------- LOGOUT ---------------------- */

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

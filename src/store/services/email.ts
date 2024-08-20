export const sendEmail = async (
  email: string,
  password: string
): Promise<{ error: null | string }> => {
  return await fetch("/api/email", {
    method: "post",
    body: JSON.stringify({
      email,
      password
    })
  }).then((data) => data.json());
};

import { createUser } from "@/utils/dbUtils/user";
import { NextResponse } from "next/server";
import z from "zod";

const createUserSchema = z
  .object({
    email: z.string().email(),
    username: z.string(),
    password: z.string(),
  })
  .strict();

function validateUserSchema(data) {
  try {
    const parseData = createUserSchema.parse(data);
    return parseData;
  } catch (error) {
    if (error.issues && error.issues.length > 0) {
      const validatedErrors = error.issues.map((issue) => ({
        path: issue.path.json("."),
        message: issue.message,
      }));
      throw new Error(JSON.stringify(validatedErrors));
    } else {
      throw new Error("Invalid Schema.");
    }
  }
}

export const POST = async (request) => {
  try {
    //get the details provided by user
    const json = await request.json();
    //understand whether the details are correct as expect.
    //--Schema validation method
    const validatedUser = validateUserSchema(json);
    //whether the detaills exist in system or not
    const createUserResult = await createUser(validatedUser);
    //return the result
    return NextResponse.json(createUserResult, { status: 200 });
  } catch (error) {
    let errorMessage;
    try {
      errorMessage = JSON.parse(error.message);
    } catch (parseError) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
};

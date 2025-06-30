import { z } from "zod/v4";
const fileSizeLimit = 250 * 1024 * 1024; // 250MB

export const allowed = [
		'text/csv',
		'application/vnd.apache.arrow.file',
		'application/vnd.apache.parquet',
		'.csv',
		'.parquet',
		'.arrow'
	];

export const fileUploadSchema = z.object({
  files: z
    .custom<FileList>()
    .refine((list) => list.length > 0, "No files selected")
    .refine((list) => list.length <= 10, "Maximum 10 files allowed")
    .transform((list) => Array.from(list))
    .refine(
      (files) => {
        const allowedTypes: { [key: string]: boolean } = {
          "text/csv": true,
          "application/vnd.apache.arrow.file": true,
          "application/vnd.apache.parquet": true,
          ".csv": true,
          ".parquet": true,
          ".arrow": true,
        };
        return files.every((file) => allowedTypes[file.type]);
      },
      { message: "Invalid file type. Allowed types: CSV, Arrow, Parquet" }
    )
    .refine(
      (files) => {
        return files.every((file) => file.size <= fileSizeLimit);
      },
      {
        message: "File size should not exceed 250MB",
      }
    ),
});
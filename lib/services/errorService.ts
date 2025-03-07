export default function errorService(errors: any, field: string) {
  if (errors?.length > 0) {
    return errors
      .find(
        (error: { field: string; message: string }) => error.field === field
      )
      ?.message.replace("_", " ");
  }
}

export default function errorService(errors: any, field: string) {
  if (errors?.length > 0) {
    return errors
      .find((error: any) => error.field === field)
      ?.message.replace("_", " ");
  }
}

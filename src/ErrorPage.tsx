import { useRouteError } from "react-router";
import "./style.scss";

export function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <>
      <div className="error">
        <h1>Oops!</h1>
        <p>Something went wrong, try reloading the page</p>
        <i>Error: {error.statusText || error.message}</i>
      </div>
    </>
  );
}

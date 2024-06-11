import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { createSupabaseServerClient } from "~/supabase.server";

const Dashboard = () => {
  return (
    <div>
      Dashboard
      <Form action="/sign-out" method="post">
        <button type="submit">Sign Out</button>
      </Form>
    </div>
  );
};

export default Dashboard;

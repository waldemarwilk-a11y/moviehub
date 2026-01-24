import React from "react";
import { useSession } from "next-auth/react";

const TestPage: React.FC = () => {
  const { data: session } = useSession();

  console.log("SESSION:", session);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Sprawdzenie sesji</h1>
      {session ? (
        <div>
          <p>Email: {session.user.email}</p>
          <p>Rola: {session.user.role}</p>
          <p>ID: {session.user.id}</p>
        </div>
      ) : (
        <p>Nie zalogowany</p>
      )}
    </div>
  );
};

export default TestPage;

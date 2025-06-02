// app/unauthorized/page.tsx
export default function UnauthorizedPage() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Access Denied</h1>
      <p>You are not authorized to view this page.</p>
      <a href="/api/auth/signin">Click here to log in</a>
    </div>
  );
}

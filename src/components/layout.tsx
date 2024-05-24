import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <h2>layout</h2>
      {/* Layout컴포넌트와 Outlet컴포넌트가 중첩되어 보여줌 */}
      {/* Outlet은 App.tsx에 구성한 router를 따라감 */}
      <Outlet />
    </>
  );
}

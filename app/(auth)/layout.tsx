// import { validateRequest } from "@/auth";
// import { redirect } from "next/navigation";

// // Define the UserRole enum to match your schema
// enum UserRole {
//   USER = "USER",
//   ADMIN = "ADMIN",
// }

// // Define the routes for each role
// const roleRoutes: Record<UserRole, string> = {
//   [UserRole.USER]: "/dashboard",
//     [UserRole.ADMIN]: "/admin",
// };

// // Function to safely convert string to UserRole
// function toUserRole(role: string): UserRole | undefined {
//   return Object.values(UserRole).includes(role as UserRole)
//     ? (role as UserRole)
//     : undefined;
// }

// export default async function RoleBasedLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const { user } = await validateRequest();

//   if (user) {
//     const userRole = toUserRole(user.role);

//     if (userRole && userRole in roleRoutes) {
//       redirect(roleRoutes[userRole]);
//     } else {
//       // Fallback route if role is not recognized
//       console.warn(`Unrecognized user role: ${user.role}`);
//       redirect("/");
//     }
//   }

//   return <>{children}</>;
//}

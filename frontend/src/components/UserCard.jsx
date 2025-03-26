const UserCard = ({ user }) => {
  return (
    <div className="user-card my-2 mx-auto w-full bg-[var(--color-recipe-fifth)] py-2 px-4 rounded-xl">
      <p>{user.username}</p>
      <p>{user.email}</p>
      <p>{user.role}</p>
    </div>
  );
};

export default UserCard;

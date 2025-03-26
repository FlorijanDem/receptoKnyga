const UserCard = ({ user }) => {
  return (
    <div className="user-card my-2 mx-auto w-full bg-[var(--color-recipe-fifth)] py-2 px-4 rounded-xl">
      <p>Username: {user.username}</p>
      <p className="text-[var(--color-recipe-secondary)]">{user.email}</p>
      <p>Role: {user.role}</p>
      {user.banned && (
        <p className="text-[var(--color-recipe-fourth)]">Banned</p>
      )}
    </div>
  );
};

export default UserCard;

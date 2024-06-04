class CheckRights:
    def __init__(self, user, record):
        self._record = record
        self.user = user

    def show(self):
        return self.user.is_authenticated

    def create(self):
        return self.user.is_admin()

    def delete(self):
        return self.user.is_admin()

    def edit(self):
        return (self.user.is_moderator() or self.user.is_admin() or
                (self.user.is_user() and self.user.id == self.user.user_id))

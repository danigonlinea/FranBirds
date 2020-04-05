import { Constants } from '.';

export const getDefaultAvatar = (type) => {
  const {
    defaultAvatar: { egg, bird },
  } = Constants;

  return type === 'Huevo' ? egg : bird;
};

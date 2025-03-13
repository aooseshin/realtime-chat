import { ActionType, dispatch } from './store';
import { ToasterProps } from './types';

const toast = {
  open: (settings: ToasterProps) => {
    dispatch({
      type: ActionType.OPEN,
      settings,
    });
  },
  close: () => {
    dispatch({
      type: ActionType.CLOSE,
    });
  },
};

export { toast };

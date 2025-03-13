import { useEffect, useState } from 'react';

import { ToasterProps } from './types';

export enum ActionType {
  OPEN,
  CLOSE,
}

type Action =
  | {
      type: ActionType.OPEN;
      settings: ToasterProps;
    }
  | {
      type: ActionType.CLOSE;
    };

interface State {
  settings: Partial<ToasterProps>;
  open: boolean;
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.OPEN:
      return {
        ...state,
        settings: action.settings,
        open: true,
      };
    case ActionType.CLOSE:
      return {
        ...state,
        open: false,
      };
    default:
      return state;
  }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { settings: {}, open: false };

export const dispatch = (action: Action) => {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
};

export const useToaster = (): State => {
  const [state, setState] = useState<State>(memoryState);
  useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return state;
};

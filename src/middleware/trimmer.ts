import { NextFunction, Request, Response } from 'express';
import { trimNested } from '../utils/functions';
//TODO remove ts-ignore()
const trimmer = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fields.forEach(field => {
      //@ts-ignore()
      if (req[field]) {
        //@ts-ignore()
        req[field] = trimNested(req[field]);
      }
    });
    next();
  };
};

export default trimmer;
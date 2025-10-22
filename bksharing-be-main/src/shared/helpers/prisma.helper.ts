import { isNil } from 'lodash';

export const removeRelation = () => ({ disconnect: true });
export const connectRelation = (value: number) => (isNil(value) ? undefined : { connect: { id: value } });

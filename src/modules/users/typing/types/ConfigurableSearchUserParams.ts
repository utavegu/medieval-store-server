import { ISearchUserParams } from '../interfaces/ISearchUserParams';

export type ConfigurableSearchUserParams = Omit<
  ISearchUserParams,
  'limit' | 'offset'
>;

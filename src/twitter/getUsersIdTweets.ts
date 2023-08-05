/**
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { twitterApi } from './lib';

export const getUserTweets = (
  id: string,
  since_id?: string
): {
  data?: Tweet[];
} => {
  return twitterApi({
    path: `users/${id}/tweets`,
    method: 'get',
    params: {
      'max_results': '100',
      'tweet.fields': 'created_at,entities',
      ...(since_id && { ...{ since_id } }),
    },
  });
};

export type Tweet = {
  id: string;
  text: string;
  created_at: string;
  entities?: {
    urls?: {
      expanded_url: string;
      images?: {
        url: string;
        width: number;
        height: number;
      }[];
      title?: string;
      description?: string;
    }[];
    hashtags?: {
      tag: string;
    }[];
  };
};

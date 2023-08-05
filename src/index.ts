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
import { getUserTweets } from './twitter/getUsersIdTweets';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const main = () => {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('tweets');
  if (!sheet) {
    throw new Error('"tweets" sheet not found');
  }
  const latestFetchedID = sheet
    .getRange(sheet.getLastRow(), 1, 1, 1)
    .getValue();
  const sinceId =
    sheet.getLastRow() === 1
      ? '1686025139773739007' // My first tweet MINUS 1 (https://twitter.com/ryuzaca/status/1686025139773739008)
      : latestFetchedID;

  const tweets = getUserTweets('1686021046791516160', sinceId).data;
  if (tweets === undefined) return;
  tweets.sort((a, b) => (Number(a.id) > Number(b.id) ? 1 : -1));
  tweets.forEach(tweet => {
    const row = [
      tweet.id,
      tweet.created_at,
      tweet.text,
      ...((tweet.entities && [
        (tweet.entities.urls && tweet.entities.urls[0].expanded_url) || '',
        (tweet.entities.urls && tweet.entities.urls[0].title) || '',
        (tweet.entities.urls && tweet.entities.urls[0].description) || '',
        (tweet.entities.urls && tweet.entities.urls[0].images?.[0].url) || '',
        ...((tweet.entities.hashtags &&
          tweet.entities.hashtags.map(h => h.tag)) ||
          []),
      ]) ||
        []),
    ];
    sheet.appendRow(row);
  });
};

require("dotenv").config();
const given = require("../../steps/given");
const then = require("../../steps/then");
const when = require("../../steps/when");
const chance = require("chance").Chance();
const path = require("path");

describe("Given an authenticated user", () => {
  let user;
  beforeAll(async () => {
    user = await given.an_authenticated_user();
  });

  describe("When a user sends a tweet", () => {
    let tweet;
    const text = chance.string({ length: 16 });
    beforeAll(async () => {
      tweet = await when.a_user_calls_tweet(user, text);
    });

    it('should return the new tweet', () => {
        expect(tweet).toMatchObject({
            text,
            replies: 0,
            likes: 0,
            retweets: 0,
        })
    });

    it('The user will see the new tweet when getTweets is called', () => {
      const {tweets, nextToken} = await when.a_user_calls_getTweets(user, user.username, 25);
      expect(nextToken).toBe(null);
      expect(tweets.length).toEqual(1);
      expect(tweets[0]).toEqual(tweet);
    });

    it('Cannot ask for > 25 tweets when getTweets is called', () => {
      await expect(when.a_user_calls_getTweets(user, user.username, 26))
      .rejects
      .toMatchObject({
        message: expect.stringContaining('max limit is 25');
      });
    });
  });
});

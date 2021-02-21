const given = require("../../steps/given");
const when = require("../../steps/when");
const then = require("../../steps/then");
const chance = require("chance").Chance();

describe("Given an authenticated user with a tweet", () => {
  let userA, tweet;
  const text = chance.string({ length: 16 });
  beforeAll(async () => {
    userA = await given.an_authenticated_user();

    tweet = await when.we_invoke_tweet(userA.username, text);
  });

  describe("when he retweets his own tweet", () => {
    beforeAll(async () => {
      await when.we_invoke_retweet(userA.username, tweet.id);
    });

    it("saves the retweet in the Tweets table", async () => {
      await then.retweet_exists_in_TweetsTable(userA.username, tweet.id)
    });

    it('save the retweet in the Retweets table', async () => {
        await then.retweet_exists_in_RetweetsTable(userA.username, tweet.id)
    });

    it('should increment the retweets count in the tweets table', async () => {
        const { retweets} = await then.retweet_exists_in_TweetsTable(userA.username, tweet.id)

        expect (retweets).toEqual(1)
    });

    
    it('should increment the tweets count in the users table', async () => {
        await then.tweetsCount_is_updated_in_UsersTable(userA.username, 2)
    });

    it('Doesnt save the retweet in the timelines tables', async () => {
      await then.there_are_N_tweets_in_TimelinesTable(userA.username, 1)

      expect (tweets[0].tweetId).toEqual(tweet.id)
    });
  });
});

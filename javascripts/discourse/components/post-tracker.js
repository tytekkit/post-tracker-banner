import Component from "@glimmer/component";
import { ajax } from "discourse/lib/ajax";
import { tracked } from "@glimmer/tracking";

export default class TopContributors extends Component {
    
    @tracked postsText = null;
  
    constructor() {
        super(...arguments);

        let settingsText = settings.text;
  
        ajax(`/site.json`).then((data) => {

            let categories = data.categories,
                newCategoryObj = {};

            for (const c of data.categories) {
                newCategoryObj[c.id] = c.name;
            }

            ajax(`/posts.json?period=weekly`).then((data) => {

                let latestPosts = data.latest_posts,
                    categoryIds = {},
                    reads = 0,
                    readersCount = 0,
                    replyCount = 0;

                for (const post of latestPosts) {
                    categoryIds[post.category_id] = categoryIds[post.category_id] +1 || 1;
                    reads += post.reads;
                    readersCount += post.readers_count;
                    replyCount += post.reply_count;
                }

                for (const [key, value] of Object.entries(categoryIds)) {
                    settingsText = settingsText.replace(`[${newCategoryObj[key]}]`, value);
                }

                settingsText = settingsText.replace("[reads]", reads);
                settingsText = settingsText.replace("[readers_count] ", readersCount );
                settingsText = settingsText.replace("[reply_count]", replyCount);

                this.postsText = settingsText;

            });

        });

        this.textAdjustment = settings.text_adjustment;

    }
  
    willDestroy() {
      this.postsText = null;
    }
  }

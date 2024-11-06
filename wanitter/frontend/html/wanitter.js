new Vue({
    el: '#app',
    data() {
        return {
            message: '',
	    result_message: '',
	    tweets: [],
	    id_newest: 0,
	    id_oldest: 0,
	    num_pending_tweets: 0,
	    is_button_disabled: true,
	    is_input_disabled: false,
	    is_new_tweet_show: false,
        }
    },
    methods: {
    	sendTweet: function(){
    		let self = this;
    		
    		this.is_button_disabled = true;
    		this.is_input_disabled = true;
    		axios.post('/api/tweet', {
    			message: this.message
    		}, {timeout: 3000}
    		).then(function(response){
    			self.updateTweets();
    			self.is_input_disabled = false;
    			self.message = "";
    			self.result_message = "ツイートしました！";
    		}).catch(function(error){
    			console.log("error post:" + error.message);	    
    			self.is_input_disabled = false;
    			self.is_button_disabled = false;
    			let str = "問題が発生しました。やりなおしてください。: " + error.message;
    			self.result_message = str;
    		})
    	},
    	updateTweets: function(){
    		let self = this;
    		this.is_new_tweet_show = false;
    		
    		axios.get('/api/tweet', {
    			params: {
    				ts: Date.now(),
    				from_id: this.id_newest + 1
    			},
    			timeout: 3000,
    		}).then(function(response){
    			let items = response.data;
    			for(let i = 0; i < items.length; i++){
    				if(self.id_newest < items[i].id){
    					self.id_newest = items[i].id;
    				}
    				if (self.id_oldest === 0 || self.id_oldest > items[i].id) {
                        self.id_oldest = items[i].id;
                    }
    			}
    			items.push(...self.tweets);
    			self.tweets = items;
    		}).catch(function(error){
    			console.log("error get: " + error.message);	    
    		})
    	},
    	loadMoreTweets: function() {
            let self = this;

            axios.get('/api/tweet', {
                params: {
                    ts: Date.now(),
                    to_id: this.id_oldest - 1//現在表示されているツイートよりも一つ古いツイートのid
                },
                timeout: 3000,
            }).then(function(response) {
                let items = response.data;
                let uniqueItems = items.filter(item => {
                    return !self.tweets.some(tweet => tweet.id === item.id);
                });
                for (let i = 0; i < uniqueItems.length; i++) {
                    if (self.id_oldest === 0 || self.id_oldest > uniqueItems[i].id) {
                        self.id_oldest = uniqueItems[i].id;
                    }
                }
                self.tweets.push(...uniqueItems);
            }).catch(function(error) {
                console.log("error get: " + error.message);
            })
    	},
    	checkTweets: function(){
    		let self = this;
    		
    		axios.get('/api/tweet/count', {
    			params: {
    				ts: Date.now(),
    				from_id: this.id_newest + 1
    			},
    			timeout: 3000,
    		}).then(function(response){
    			self.num_pending_tweets = response.data;
    			if(self.num_pending_tweets == 0){
    				self.is_new_tweet_show = false;
    			}else{
    				self.is_new_tweet_show = true;
    			}
    		}).catch(function(error){
    			console.log("error get: " + error.message);	    
    		})
    	},
    	formatTimestamp: function(ts){
    		ts = new Date(ts);
    		let ret = "";
    		let year = ts.getFullYear();
    		ret = year + "/";
    		let month = ts.getMonth() + 1;
    		
    		if(month <= 9){
    			ret = ret + "0" + month + "/";
    		}else{
    			ret = ret + month + "/";
    		}
    		
    		let day = ts.getDate();
    		if(day <= 9){
    			ret = ret + "0" + day + " ";
    		}else{
    			ret = ret + day + " ";
    		}
    		
    		let hour = ts.getHours();
    		if(hour <= 9){
    			ret = ret + "0" + hour + ":";
    		}else{
    			ret = ret + hour + ":";
    		}
    		
    		let min = ts.getMinutes();
    		if(min <= 9){
    			ret = ret + "0" + min + ":";
    		}else{
    			ret = ret + min + ":";
    		}
    		
    		let sec = ts.getSeconds();
    		if(sec <= 9){
    			ret = ret + "0" + sec;
    		}else{
    			ret = ret + sec;
    		}
    		
    		return ret;
    	},
    	handleScroll: function() {
    		if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
    			this.loadMoreTweets();
    		}
    	}
    },
    watch: {
    	message: function(newVal, oldVal) {
    		if(newVal.length > 0){
    			this.is_button_disabled = false;
    		}else{
    			this.is_button_disabled = true;
    		}
    	}
    },
    mounted: function(){
    	this.updateTweets();
    	let self = this;
    	setInterval(self.checkTweets, 30000);
    	window.addEventListener('scroll', self.handleScroll);
    },
    beforeDestroy: function() {
        window.removeEventListener('scroll', this.handleScroll);
    }
})
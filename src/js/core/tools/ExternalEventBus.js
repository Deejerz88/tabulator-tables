export default class ExternalEventBus {

	constructor(optionsList, debug){
		this.events = {};
		this.optionsList = optionsList || {};
		this.subscriptionNotifiers = {};

		this.dispatch = debug ? this._debugDispatch.bind(this) : this._dispatch.bind(this);
	}

	subscriptionChange(key, callback){
		if(!this.subscriptionNotifiers[key]){
			this.subscriptionNotifiers[key] = [];
		}

		this.subscriptionNotifiers[key].push(callback);

		if(this.subscribed(key)){
			this._notifiySubscriptionChange(key, true);
		}
	}

	subscribe(key, callback){
		if(!this.events[key]){
			this.events[key] = [];
		}

		this.events[key].push(callback);

		this._notifiySubscriptionChange(key, true);
	}

	unsubscribe(key, callback){
		var index;

		if(this.events[key]){
			if(callback){
				index = this.events[key].findIndex((item) => {
					return item === callback;
				});

				if(index > -1){
					this.events[key].splice(index, 1);
				}else{
					console.warn("Cannot remove event, no matching event found:", key, callback);
					return;
				}
			}else{
				delete this.events[key];
			}
		}else{
			console.warn("Cannot remove event, no events set on:", key);
			return;
		}

		this._notifiySubscriptionChange(key, false);
	}

	subscribed(key){
		return this.events[key] && this.events[key].length;
	}

	_notifiySubscriptionChange(key, subscribed){
		var notifiers = this.subscriptionNotifiers[key];

		if(notifiers){
			notifiers.forEach((callback)=>{
				callback(subscribed);
			});
		}
	}

	_dispatch(){
		var args = Array.from(arguments),
		key = args.shift(),
		result;

		if(this.events[key]){
			this.events[key].forEach((callback, i) => {
				let callResult = callback.apply(this, args);

				if(!i){
					result = callResult;
				}
			});
		}

		return result;
	}

	_debugDispatch(){
		var args = Array.from(arguments);
		args[0] = "Event:" + args[0];

		console.log(...args);

		return this._dispatch(...arguments)
	}
}
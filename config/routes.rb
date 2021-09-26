Rails.application.routes.draw do
	root to:'home#index'
	get '/documentation', to: 'home#documentation'
	get '/components/:component', to: 'home#component', as: :component
	get '/developers', to: 'home#developers'
	get '/themes', to: 'home#themes'
	get '/examples', to: 'home#examples'
end

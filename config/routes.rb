Rails.application.routes.draw do
	root 'home#chatbot'
	get 'home/chatbot'
	get '/iframe', to: 'home#iframe'
	get '/template', to: 'home#template'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end

AchaCasas::Application.routes.draw do

  #resources :announces
  resources :photos

  # :path modifica o caminho, no caso de "/users" para "/u"
  devise_for :users, :path => "u", :controllers => { :registrations => "devise/registrations" }
  devise_for :users do
    get "login", :to => "devise/sessions#new"
    get "logout", :to => "devise/sessions#destroy"
    get "problemas_conta", :to => "devise/passwords#new"
  end

  resources :users, :only => [:show, :index], :path => "u"
  resources :search, :only => [:index, :notfound], :path => "busca"

  resources :properties, :path => "i"

  #criar /faq para a action faq da Controller Home
  match '/faq', :to => 'home#faq', :as => :faq
  match '/about', :to => 'home#about', :as => :about
  match '/notfound', :to => 'search#notfound', :as => :notfound
  match '/properties/interessado', :to => 'properties#interessado', :as => 'interessado'
  match '/interesses/destroy', :to => 'interesses#destroy', :as => 'desinteressado'
  #match '/escolher_plano', :to => 'announces#new', :as => 'escolher_plano'
  #match '/pagamento', :to => 'announces#pagamento', :as => 'pagamento'
  match '/comoanunciar', :to => 'properties#como_anunciar', :as => 'como_anunciar'
  #match '/checkout', :to => 'properties#checkout', :as => 'checkout'
  match '/interessados', :to => 'users#interessados', :as => '/interessados'
  #match '/confirmacao_de_pagamento', :to => 'announces#confirmacao_de_pagamento', :as => "confirmacao_de_pagamento"
  #match 'announces/payment', :to => 'announces#payment_return', :as => 'announces/payment'
  match 'i/:id/falarcomdono', :to => 'properties#falarcomdono', :as => 'falarcomdono'
  match 'i/:id/indicar', :to => 'properties#indicar', :as => 'indicar'
  match 'contato_amigo', :to => 'properties#contato_amigo'
  match 'contato_dono', :to => 'properties#contato_dono'
  match '/denunciar', :to => 'properties#denunciar'
  match 'ajuda', :to => 'supports#index', :as => 'ajuda'
  match '/suporte/contato', :to => 'supports#contato', :as => 'contato'
  match '/suporte/contato_mail', :to => 'supports#contato_mail'
  match '/suporte/flag', :to => 'supports#flag'
  match '/suporte/denuncie', :to => 'supports#denuncie', :as => 'denuncie'
  match '/suporte/seguranca', :to => 'supports#security', :as => 'seguranca'
  match '/suporte/busca', :to => 'supports#search', :as => 'dicas_busca'
  match 'termos', :to => 'supports#terms', :as => "termos"

  # Necessário para que qualquer caminho que não existe (ex.: http://localhost:3000/nada)
  # seja redirecionado para a página estática do "erro 404"
  match "*path" => 'application#render_not_found'

  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  root :to => "home#index"

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  match ':controller(/:action(/:id(.:format)))'
end


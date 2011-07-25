class ApplicationController < ActionController::Base
  before_filter :store_location
  protect_from_forgery

  unless Rails.application.config.consider_all_requests_local
	  rescue_from Exception, :with => :render_error
	  rescue_from ActiveRecord::RecordNotFound, :with => :render_not_found
	  rescue_from AbstractController::ActionNotFound, :with => :render_not_found
	  rescue_from ActionController::RoutingError, :with => :render_not_found
	  rescue_from ActionController::UnknownController, :with => :render_not_found
	  rescue_from ActionController::UnknownAction, :with => :render_not_found
	end

	def render_error exception
	  Rails.logger.error(exception)
	  @erro = Error.create(:tipo => "500")
	  @erro.save
	  render :file => "#{Rails.root}/public/500.html", :status => 500, :layout => false
	end

	def render_not_found exception
	  Rails.logger.error(exception)
	  @erro = Error.create(:tipo => "404")
	  @erro.save
	  render :file => "#{Rails.root}/public/404.html", :status => 404, :layout => false
	end

	def after_sign_in_path_for(resource)
	  session[:return_to]
  end

 	private
  # Método responsável por armazenar o último local visto antes de ir para a tela de login
  def store_location
    if request.get? && request.format.html? && !request.xhr? && !devise_controller?
      session[:return_to] = request.fullpath
    end
  end


end


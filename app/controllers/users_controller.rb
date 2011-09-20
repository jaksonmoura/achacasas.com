class UsersController < ApplicationController
   before_filter :authenticate_user!, :only => [:interessados]
   uses_tiny_mce :options => {
                              :theme => 'advanced',
                              :language => 'pt',
                              :theme_advanced_resizing => true,
                              :theme_advanced_resize_horizontal => false,
                              :plugins => %w{ fullscreen }
                            }

  #def index
  #	@search = User.search(params[:search])
  #	@users = @search.order("updated_at").page(params[:page]).per(params[:per_page])

  # respond_to do |format|
  #    format.html # index.html.erb
  #    format.js
  #    format.xml  { render :xml => @properties }
  #  end
  #end

  def index
    redirect_to root_path
  end

  def interessados
    @properties = Property.where("user_id = ? AND visivel = ?", current_user.id, true).order("updated_at").page(params[:page]).per(10)
  end

  def show
  @user = User.find(params[:id])
  @imoveis = @user.properties.where("publico = ?", true).count
  if user_signed_in? and current_user.id == @user.id
    @donologado = true
    @properties = @user.properties.find(:all, :include => :capa)
    @properties = Kaminari.paginate_array(@properties).page(params[:page]).per(5)
    # Busca os interesses do usuário
    @interesses = Interessado.where("user_id = ?", current_user.id)
  else # Busca imóveis públicos
    @donologado = false
    @properties = @user.properties.where("visivel = true").page(params[:page]).per(9)
  end
    respond_to do |format|
      format.html # show.html.erb
      format.js
      format.xml  { render :xml => @property }
    end
  end

end


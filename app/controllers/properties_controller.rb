class PropertiesController < ApplicationController
   before_filter :authenticate_user!, :except => [:show, :como_anunciar, :contato_dono, :contato_amigo, :indicar, :falarcomdono]
   before_filter :dono_logado, :only => [:edit, :destroy]
   uses_tiny_mce :options => {:theme => 'simple', :language => 'pt',
                              :theme_advanced_resizing => true,
                              :theme_advanced_resize_horizontal => false,
                              :plugins => %w{ fullscreen }}
  def index
  	redirect_to(:action => "index", :controller => "home")
  end

  def show
  	@search = Property.search(params[:search])
    @property = Property.find(params[:id])
    if user_signed_in? and current_user.id == @property.user_id
      donologado = true
    end
    if @property.visivel or donologado
      if user_signed_in?
          @userint = Interessado.where("user_id = ? and property_id = ?", current_user.id, @property.id)
          @last_user_flag = Flag.where("user_id = ? AND flaggable_id = ?", current_user.id, @property.id).last
      end

      respond_to do |format|
        format.html # show.html.erb
        format.js
        format.xml  { render :xml => @property }
      end
    else
      render :file => "#{Rails.root}/public/404.html", :status => 404, :layout => false
    end
  end

  def new
  	@search = Property.search(params[:search])
    @property = Property.new
    @next = 1
    10.times { @property.photos.build }

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @property }
    end
  end

  def edit
  	@search = Property.search(params[:search])
    @property = Property.find(params[:id])

    # Se o usuário atual for dono da propriedade
  	if current_user.id == @property.user_id
  		@photos = Photo.where("property_id = ?", @property.id)
		  @left = @photos.count
		  @next = @left + 1
		  @left = 10-@left
		  # @N.times { @property.photos.build }
  	else
  		render :action => "show"
  	end

  end

  # POST /properties
  # POST /properties.xml
  def create
    @property = Property.create(params[:property])
    @property.user_id = current_user.id
    @property.status = "Criado"
    @property.referencia = (Date.today.year.to_s + @property.id.to_s).to_i
    @property.latitude = params[:latitude]
    @property.longitude = params[:longitude]
    @property.visivel = false

    respond_to do |format|
      if @property.save
        format.html { redirect_to new_announce_path(:const => SecureRandom.hex(16) + @property.id.to_s), :notice => 'Seu imóvel foi criado! Você precisa agora anunciá-lo!' }
        format.js
        format.xml  { render :xml => @property, :status => :created, :location => @property }
      else
        format.html { render :action => "new" }
        format.js
        format.xml  { render :xml => @property.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /properties/1
  # PUT /properties/1.xml
  def update
    @property = Property.find(params[:id])
      respond_to do |format|
        if @property.update_attributes(params[:property])
          format.html { redirect_to(@property, :notice => 'Seu imóvel foi atualizado!') }
          format.js
          format.xml  { head :ok }
        else
          format.html { render :action => "edit" }
          format.js
          format.xml  { render :xml => @property.errors, :status => :unprocessable_entity }
        end
      end
  end

  # DELETE /properties/1
  # DELETE /properties/1.xml
  def destroy
    @property = Property.find(params[:id])
    redirect_to(@property) and return if params[:cancel]
    @property.destroy

    respond_to do |format|
      format.html { redirect_to(properties_url) }
      format.js
      format.xml  { head :ok }
    end
  end

  def interessado
  	@interessado = Interessado.new
  	@interessado.user_id = current_user.id
  	@interessado.property_id = params[:propertyid]
  	@interessado.save
  	respond_to do |format|
      if @interessado.save
        InteresseMailer.novo_interessado(current_user, @interessado.property_id).deliver
        format.html { redirect_to(:back, :notice => 'Você foi marcado como interessado neste imóvel!') }
        format.js
        format.xml  { render :xml => @property, :status => :created, :location => @property }
      end
    end
  end

  def anunciar
      @property = Property.find(params[:id])
      @property.status = 1;
      @property.save
       respond_to do |format|
          if @property.save
            format.html { redirect_to(:back, :notice => 'Você acabou de anunciar!') }
            format.js
            format.xml  { head :ok }
          end
        end
  end

  def como_anunciar
  end

  def pagamento
    @imovel = Property.find(params[:const][32, params[:const].length - 32])
    unless session[:sha] == params[:const]
      redirect_to(session[:imv], :notice => "Houve algum erro que o impediu de acessar a página!")
    end
  end

  def indicar
    @property = Property.find(params[:id])
  end

  def falarcomdono
    @property = Property.find(params[:id])
  end

  def contato_amigo
    if params[:nome_contato] && !params[:nome_contato].blank? && params[:email_contato] && !params[:email_contato].blank? && params[:nome_amigo_contato] && !params[:nome_amigo_contato].blank? && params[:email_amigo_contato] && !params[:email_amigo_contato].blank? && params[:mensagem] && !params[:mensagem].blank?
      PropertiesMailer.enviar_amigo(params[:property_id], params[:nome_contato], params[:email_contato], params[:nome_amigo_contato], params[:email_amigo_contato], params[:mensagem]).deliver
      redirect_to :back, :notice => "Seu e-mail foi enviado!"
    else
      redirect_to :back, :notice => "Não foi possível enviar este e-mail! Algum campo não foi inserido?"
    end
  end

  def contato_dono
    if params[:nome_contato] && !params[:nome_contato].blank? && params[:email_contato] && !params[:email_contato].blank? && params[:mensagem] && !params[:mensagem].blank?
      PropertiesMailer.falar_com_dono(params[:property_id], params[:nome_contato], params[:email_contato], params[:mensagem]).deliver
      redirect_to :back, :notice => "Seu e-mail foi enviado!"
    else
      redirect_to :back, :notice => "Não foi possível enviar este e-mail! Algum campo não foi inserido?"
    end
  end

  def denunciar
    @last_user_flag = Flag.where("user_id = ? AND flaggable_id = ?", current_user.id, params[:pid]).last
    if @last_user_flag.nil?
      @flag = Flag.create(:comment => "I am offended by that!", :flaggable_id => params[:pid], :user_id => current_user.id)
      @flag.save
      redirect_to :back, :notice => "Obrigado por colaborar com o Acha-Casas!"
    else
      @last_user_flag.destroy
      redirect_to :back, :notice => "Sua denuncia foi exluída!"
    end
  end

  private
  def dono_logado
    property = Property.find(params[:id])
    unless current_user.id == property.user_id
      redirect_to root_path, :notice => "Você não pode fazer isso!"
    end
  end

end


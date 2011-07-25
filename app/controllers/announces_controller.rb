class AnnouncesController < ApplicationController
  before_filter :authenticate_user!, :except => [:confirmacao_de_pagamento]
  skip_before_filter :verify_authenticity_token

  def new
    @announce = Announce.new
    @property = Property.find(params[:const][32, params[:const].length - 32])
    # Implementar rotina para averiguar se o imovel já está anunciado e quando acaba.
    # Informar ao usuário que caso ele pague mais uma vez para aquele imóvel,
    # este terá sua data de fim de publicação incrementada.
  end

  def create
    @announce = Announce.new(params[:announce])
    @property = Property.find_by_id(@announce.property_id)
    if current_user.id == @property.user_id
      @announce.token = Digest::SHA1.hexdigest("#{Time.now}#{current_user.email}").slice(0,30).upcase
      @announce.status = "criado"
      case @announce.plano.to_i
        when 0
          @announce.valor = 3000
        when 1
          @announce.valor = 7500
        when 2
          @announce.valor = 14000
        when 3
          @announce.valor = 24000
      end
      respond_to do |format|
        if @announce.save
          format.html { redirect_to(pagamento_path(:token => @announce.token, :pid => @announce.property_id), :notice => 'Plano escolhido! Agora, confirme o pagamento...') }
         # AnnounceMailer.novo_anuncio(@announce.id, @property.id, current_user).deliver
        else
          format.html { render :action => "new" }
          format.xml  { render :xml => @announce.errors, :status => :unprocessable_entity }
        end
      end
    else
      redirect_to(root_path, :notice => 'Solicitação indevída!')
    end
  end

  def pagamento
    @property = Property.find_by_id(params[:pid])
    @announce = Announce.find_by_token!(params[:token])
    if current_user.id == @property.user_id and current_user.id == @announce.user_id and @property.id == @announce.property_id
      # Instanciando o objeto para geração do formulário
      #@order = PagSeguro::Order.new(@announce.token)
      case @announce.plano.to_i
        when 0
          @valorpag = 3000
          @desc = "Publicação de imóvel por um mês no Acha-Casas.com - ref. #{@property.referencia}"
        when 1
          @valorpag = 7500
          @desc = "Publicação de imóvel por três meses no Acha-Casas.com - ref. #{@property.referencia}"
        when 2
          @valorpag = 12000
          @desc = "Publicação de imóvel por um semestre no Acha-Casas.com - ref. #{@property.referencia}"
        when 3
          @valorpag = 24000
          @desc = "Publicação de imóvel por um ano no Acha-Casas.com - ref. #{@property.referencia}"
      end
      @response = Moip.checkout(attributes = {:reason => @desc,:id => @announce.toke.to_s,:value=>@valorpag, :id_carteira=>"jrochelly"})
    else
      redirect_to(@property, :notice => 'Ocorreu algum erro! Por favor, tente novamente!')
    end
  end

  def confirmacao_de_pagamento
  end

  def payment_return
    if request.post? and params[:MoIPpost] == "Nasp_true"
      notification = Moip.notification(params)
      announce = Announce.find_by_token(notification.id_transacao)
      property = Property.find_by_id(announce.property_id)

      announce.update_payment_data!(notification)
      case notification.status
        when 1
          property.update_attribute(:status, "autorizado")
        when 2
          property.update_attribute(:status, "iniciado")
        when 3
          property.update_attribute(:status, "boleto impresso")
        when 4
          property.update_attribute(:status, "concluido")
        when 5
          property.update_attribute(:status, "cancelado")
        when 6
          property.update_attribute(:status, "em análise")
      end

      logger.info { notification.to_yml }
      render :text=>"Status changed", :status=>200
    else
      redirect_to(root_path, :notice => "Solicitação inválida!")
    end
  end

end


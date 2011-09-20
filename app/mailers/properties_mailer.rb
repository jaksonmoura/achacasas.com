class PropertiesMailer < ActionMailer::Base
  default :from => "robot@achacasas.com"

  #def expira_amanha(property_id)
  #  @imovel = Property.find_by_id(property_id)
  #  @user = User.find_by_id(@imovel.user_id)
  #  mail(:to => @user.email,
  #       :subject => "Acha-Casas | Fim do período de anuncio")
  #end

  #def expira_em_uma_semana(property_id)
  #  @imovel = Property.find_by_id(property_id)
  #  @user = User.find_by_id(@imovel.user_id)
  #  mail(:to => @user.email,
  #       :subject => "Acha-Casas | Falta apenas uma semana")
  #end

  # Se chegar ao fim do anuncio
  #def fim_anuncio(property_id)
  #  @imovel = Property.find_by_id(property_id)
  #  @user = User.find_by_id(@imovel.user_id)
  #  mail(:to => @user.email,
  #       :subject => "Acha-Casas | Fim do período de anuncio")
  #end

  # Se o usuário pagou perto do vencimento e a transferência está pendente
  #def fim_extendido(property_id)
  #  @imovel = Property.find_by_id(property_id)
  #  @user = User.find_by_id(@imovel.user_id)
  #  mail(:to => @user.email,
  #       :subject => "Acha-Casas | Fim do período de anuncio")
  #end

  def enviar_amigo(property_id, nome_contato, email_contato, nome_amigo, email_amigo, mensagem)
      @imovel = Property.find_by_id(property_id)
      @dono = User.find_by_id(@imovel.user_id)
      @nome_contato = nome_contato
      @email_contato = email_contato
      @nome_amigo = nome_amigo
      @email_amigo = email_amigo
      @mensagem = mensagem
      mail(:to => @dono.email,
           :subject => "Acha-Casas | #{@nome_amigo} quer que você veja algo")
  end

  def falar_com_dono(property_id, nome_contato, email_contato, mensagem)
    unless property_id && nome_contato && email_contato && mensagem
      @imovel = Property.find_by_id(property_id)
      @dono = User.find_by_id(@imovel.user_id)
      @nome_contato = nome_contato
      @email_contato = email_contato
      @mensagem = mensagem
      mail(:to => @dono.email,
           :subject => "Acha-Casas | Alguém quer falar com você")
    end
  end

end


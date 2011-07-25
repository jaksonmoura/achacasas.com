class UserMailer < ActionMailer::Base
  default :from => "jrochelly@gmail.com"

  def imovel_publicado(property_id, user_id)
    @property = Property.find_by_id(property_id)
    @user = User.find_by_id(user_id)
    @site = "http://achacasas.com"
    mail(:to => @user.email,
         :subject => "Acha-Casas | Seu imóvel já está nor ar!")
  end

end


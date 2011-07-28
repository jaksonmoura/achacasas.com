class InteresseMailer < ActionMailer::Base
  default :from => "contato@conptus.com"
  def novo_interessado(user_i, imovel)
    @user = user_i
    @site = "http://achacasas.com"
    @imovel = Property.find(imovel)
    @dono = User.where("id = ?", @imovel.user_id).first
    @photo = @imovel.photos.find_by_miniatura(true)
    @photoloc = @photo.photo.url(:small) if @photo
    @photoloc = "/system/photos/defaulthome_thumb.png" unless @photo
    mail(:to => @dono.email, :subject => "Acha-Casas | Alguém se interessou pelo seu imóvel!")
  end
end


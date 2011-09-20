class AnnounceMailer < ActionMailer::Base
  default :from => "robot@achacasas.com"
  def novo_anuncio(anuncio, imovel, user)
    @anuncio = Announce.find_by_id(anuncio)
    @imovel = Property.find_by_id(imovel)
    @photo = @imovel.photos.find_by_miniatura(true)
    @photoloc = @photo.photo.url(:small) if @photo
    @photoloc = "/system/photos/defaulthome_thumb.png" unless @photo
    @user = user
    mail(:to => @user.email, :subject => "Acha-Casas | Obrigado por anunciar no Acha-Casas")
  end
end


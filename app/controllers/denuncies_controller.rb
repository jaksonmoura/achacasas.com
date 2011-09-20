class DenunciesController < ApplicationController
  def new
    @flag = Denuncie.new
  end

  def create
    @flag = Denuncie.new(params[:flag])
    if @flag.valid?
      if SupportsMailer.denuncie(@flag).deliver
        redirect_to(root_path, :notice => "Denúncia enviada!")
      else
        redirect_to(denuncies_path, :notice => "Ocorreu um erro ao enviar a mensagem. Tente novamente!")
      end
    else
      redirect_to(denuncies_path, :notice => "Ocorreu um erro ao enviar a mensagem. Tente novamente!")
    end
  end

end


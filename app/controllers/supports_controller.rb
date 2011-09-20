class SupportsController < ApplicationController

  def index
  end

  def denuncie
  end

  def flag
    if SupportsMailer.denuncie(params[:flag]).deliver
      redirect_to(root_path, :notice => "Denúncia enviada!")
    else
      redirect_to(denuncie_path, :notice => "Ocorreu um erro ao enviar a mensagem. Tente novamente!")
    end
  end

  def contato
  end

  def contato_mail
    if SupportsMailer.contato(params[:contato]).deliver
      redirect_to(root_path, :notice => "Mensagem enviada!")
    else
      redirect_to(denuncie_path, :notice => "Ocorreu um erro ao enviar a mensagem. Tente novamente!")
    end
  end

  def terms
  end

  def search
  end

  def security
  end

end


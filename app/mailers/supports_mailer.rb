class SupportsMailer < ActionMailer::Base
  default :from => "robot@achacasas.com"

  def denuncie(flag)
    @nome = flag[:nome]
    @mensagem = flag[:mensagem]
    @email = flag[:email]
    mail(:to => "suporte@achacasas.com",
         :subject => "Denúncia")
  end

  def contato(contato)
    @nome = contato[:nome]
    @mensagem = contato[:mensagem]
    @email = contato[:email]
    @tipo = contato[:tipo]
    mail(:to => "suporte@achacasas.com",
         :subject => "#{@tipo}")
  end

end


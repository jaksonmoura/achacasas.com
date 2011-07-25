class Property < ActiveRecord::Base
  can_be_flagged
	# Permite que os dados sejam gravados e acessados
    attr_accessible :photos_attributes, :logradouro, :complemento, :pontoreferencia, :wc, :negocio, :cep, :vagas, :valor,
    :quartos, :estado, :area, :bairro, :suites, :salas, :numero, :cidade, :descricao, :status, :tipoImovel,
    :latitude, :longitude
    belongs_to :user
    has_many :photos, :dependent => :destroy
    has_many :announces
    has_many :interessados, :dependent => :destroy
    has_one :capa, :class_name => "Photo", :conditions => {:miniatura => true}
    accepts_nested_attributes_for :photos, :allow_destroy => true

    # Proibindo que busca pelos atributos...
    attr_unsearchable :status, :user_id, :id, :latitude, :longitude

    # Validações
    validates_presence_of 		:logradouro, :message => "Logradouro é um campo obrigatório."
    validates_length_of 		  :logradouro, :within => 1..100, :too_short => "O campo logradouro está muito curto, digite algo acima de 5 caracteres.", :too_long => "O campo logradouro está muito grande, digite um logradouro menor."
    validates_presence_of 		:numero,  	 :message => "Número é um campo obrigatório."
    validates_length_of 		  :numero, 	   :within => 1..10, :too_long => "O campo Número está muito grande, digite um número menor."
    validates_presence_of 		:bairro, 	   :message => "Bairro é um campo obrigatório."
    validates_length_of 		  :bairro, 	   :within => 1..100, :too_short => "O campo Bairro está muito curto, digite algo acima de 5 caracteres.", :too_long => "O campo Bairro está muito grande, digite um bairro menor."
    validates_presence_of 		:cidade, 	   :message => "Cidade é um campo obrigatório."
    validates_length_of 		  :cidade, 	   :within => 1..100, :too_short => "O campo Cidade está muito curto, digite algo acima de 5 caracteres.", :too_long => "O campo Cidade está muito grande, digite uma cidade menor."
    validates_presence_of 		:estado, 	   :message => "Estado é um campo obrigatório."
    validates_presence_of 		:cep, 	 	   :message => "CEP é um campo obrigatório."
    validates_length_of 		  :cep, 		   :within => 8..9, :too_short => "CEP não está correto. Por favor, digite-o corretamente.", :too_long => "CEP não está correto. Por favor, digite-o corretamente."
    validates_presence_of 		:negocio, 	 :message => "Negócio é um campo obrigatório."
    validates_presence_of 		:tipoImovel, :message => "O Tipo de imóvel é um campo obrigatório."
    validates_presence_of 		:valor, 	   :message => "Valor é um campo obrigatório."
    validates_presence_of 		:area, 		   :message => "Área é um campo obrigatório."

    def self.atualiza_imovel(qtde_dias)
      if self.data_fim < Date.today
        self.data_inicio = Date.today
        self.data_fim = qtde_dias.from_now
        self.visivel = true
        self.save
      end
      if self.data_fim >= Date.today
        self.data_fim += qtde_dias.days
        self.visivel = true
        self.save!
      end
    end

    def self.verifica_vencimento
      properties = Property.where('visivel = ?', true).all
      properties.each do |property|
        # Verifica se falta 1 semana para o vencimento
        if property.data_fim == 1.week.from_now
          # Enviar email para o dono do imóvel avisando
          PropertiesMailer.expira_em_uma_semana(property.id).deliver
        end
        # Verifica se é o ultimo dia do imóvel
        if property.data_fim == 1.day.from_now
          PropertiesMailer.expira_amanha(property.id).deliver
        end

        # Verifica se acabou hoje!
        if property.data_fim == Date.today
          # Verifica se usuário já enviou um novo pagamento
          if property.status == 'iniciado' or property.status == 'em análise' or property.status == 'autorizado'
            property.data_fim += 2.days
            property.save
            PropertiesMailer.fim_extendido(property.id).deliver
          else
            # Envia email para o dono avisando
            property.visivel = false
            property.save
            PropertiesMailer.fim_anuncio(property.id).deliver
          end

        end
      end
    end

end


# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20110901022829) do

  create_table "announces", :force => true do |t|
    t.string   "pagamento"
    t.integer  "property_id"
    t.integer  "user_id"
    t.string   "status"
    t.decimal  "valor",          :precision => 10, :scale => 0
    t.string   "plano"
    t.integer  "transaction_id"
    t.string   "payment_method"
    t.datetime "processed_at"
    t.date     "data_inicio"
    t.date     "data_fim"
    t.string   "token"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "announces", ["token"], :name => "index_announces_on_token", :unique => true

  create_table "errors", :force => true do |t|
    t.string   "tipo"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "flags", :force => true do |t|
    t.text     "comment"
    t.integer  "flaggable_id"
    t.string   "flaggable_type"
    t.integer  "user_id"
    t.string   "role",           :default => "abuse"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "flags", ["flaggable_type", "flaggable_id"], :name => "index_flags_on_flaggable_type_and_flaggable_id"
  add_index "flags", ["user_id"], :name => "index_flags_on_user_id"

  create_table "interessados", :force => true do |t|
    t.integer  "user_id"
    t.integer  "property_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "photos", :force => true do |t|
    t.string   "destricao"
    t.boolean  "miniatura"
    t.integer  "property_id"
    t.string   "photo_file_name"
    t.string   "photo_content_type"
    t.integer  "photo_file_size"
    t.datetime "photo_updated_at"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "descricao"
  end

  add_index "photos", ["property_id"], :name => "index_photos_on_property_id"

  create_table "properties", :force => true do |t|
    t.string   "descricao"
    t.string   "logradouro"
    t.string   "numero"
    t.string   "bairro"
    t.string   "referencia"
    t.string   "cidade"
    t.string   "estado"
    t.string   "cep"
    t.string   "status"
    t.integer  "quartos"
    t.integer  "suites"
    t.integer  "salas"
    t.integer  "wc"
    t.integer  "vagas"
    t.float    "area"
    t.string   "tipoImovel"
    t.string   "negocio"
    t.float    "valor"
    t.integer  "user_id"
    t.integer  "flags_count"
    t.string   "latitude"
    t.string   "longitude"
    t.date     "data_inicio"
    t.date     "data_fim"
    t.string   "pontoreferencia"
    t.boolean  "publico"
    t.boolean  "visivel"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "properties", ["id", "visivel"], :name => "index_properties_on_id_and_visivel"

  create_table "slugs", :force => true do |t|
    t.string   "name"
    t.integer  "sluggable_id"
    t.integer  "sequence",                     :default => 1, :null => false
    t.string   "sluggable_type", :limit => 40
    t.string   "scope"
    t.datetime "created_at"
  end

  add_index "slugs", ["name", "sluggable_type", "sequence", "scope"], :name => "index_slugs_on_n_s_s_and_s", :unique => true
  add_index "slugs", ["sluggable_id"], :name => "index_slugs_on_sluggable_id"

  create_table "tipoimoveis", :force => true do |t|
    t.string   "tipo"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", :force => true do |t|
    t.string   "email",                               :default => "", :null => false
    t.string   "encrypted_password",   :limit => 128, :default => "", :null => false
    t.string   "password_salt",                       :default => "", :null => false
    t.string   "reset_password_token"
    t.string   "remember_token"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",                       :default => 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.string   "nome"
    t.string   "password"
    t.string   "telefone1"
    t.string   "celular"
    t.string   "descricao"
    t.boolean  "termo"
    t.boolean  "newsletter"
    t.string   "cached_slug"
    t.boolean  "publico"
    t.string   "avatar_file_name"
    t.string   "avatar_content_type"
    t.integer  "avatar_file_size"
    t.datetime "avatar_updated_at"
    t.string   "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "users", ["email"], :name => "index_users_on_email", :unique => true
  add_index "users", ["id", "cached_slug"], :name => "index_users_on_id_and_cached_slug"
  add_index "users", ["reset_password_token"], :name => "index_users_on_reset_password_token", :unique => true

end

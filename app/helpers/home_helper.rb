module HomeHelper
   def properties_for_select
     @estados = [["AC"],["AL"],["AP"],["AM"],["BA"],["CE"],["DF"],["ES"],["GO"],
    ["MA"],["MT"],["MS"],["MG"],["PA"],["PB"],["PR"],["PE"],["PI"],["RJ"],["RN"],
    ["RS"],["RO"],["RR"],["SC"],["SP"],["SE"],["TO"]]
    @estados.collect { |p| [p, p] }
  end
end


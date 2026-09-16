insert
	into
	auth.usuarios
(
	email,
	senha,
	criado_em,
	atualizado_em)
values(
'tester@test.com',
'$2y$10$WyA1LR9CyTyF9pcVOVeza.KiYcHgPLPztU.xX4loTF2faTYBcDDSC', -- senha
CURRENT_TIMESTAMP,
CURRENT_TIMESTAMP);